export const facilitiesHooks = {
  before: {
    create: [setIdValue, setOwnerValue, incrementId],
  },
};

const kebabCase = (string) =>
  string.replace(/[\W_]+|(?<=[a-z0-9])(?=[A-Z])/g, "-");

const incrementFinalNumber = (string) =>
  string.replace(/(\d*)$/, (data) => {
    return parseInt(data || 0) + 1;
  });

async function setIdValue(context) {
  const {
    data: { zip, state, name },
  } = context;
  context.data._id = `${state}${zip}-${kebabCase(name)}`.slice(0, 50);
}

async function setOwnerValue(context) {
  const { userId } = context.params;
  context.data.owners = [userId];
}

async function incrementId(context) {
  const matching = await context.service.find({
    query: {
      _id: {
        $regex: `^${context.data._id}\\d*$`,
      },
      $select: ["_id"],
    },
  });
  if (matching && matching.length) {
    const { _id } = matching[matching.length - 1];
    context.data._id = incrementFinalNumber(_id);
  }
}
